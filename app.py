# backend/app.py
from fuzzywuzzy import fuzz
import pytesseract
import os, subprocess
from flask import Flask, request, jsonify, send_from_directory
import fitz  # PyMuPDF
from PIL import Image, ImageDraw
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set absolute path for assets folder
app.config['UPLOAD_FOLDER'] = os.getcwd() + 'assets'
# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Specify the path to the Tesseract executable
# pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
# pytesseract.pytesseract.tesseract_cmd = os.getcwd() + '/tessdata/5.3.3/bin/tesseract'

def highlight_exact_matches(screenshot, search_phrase, near_matches_text):
    """
    The function `highlight_exact_matches` takes a screenshot image, a search phrase, and a near matches
    text, and highlights any exact matches between the search phrase and the near matches text in the
    screenshot image.
    
    :param screenshot: The screenshot parameter is the file path or file object of the screenshot image
    that you want to process and highlight the exact matches in
    :param search_phrase: The search phrase is the exact phrase you want to search for in the
    screenshot. For example, if you want to search for the phrase "Hello World", you would pass "Hello
    World" as the search phrase parameter
    :param near_matches_text: The `near_matches_text` parameter is a string that contains the text that
    may not be an exact match to the search phrase, but is close enough to be considered a near match
    """
    # Convert the screenshot to a Pillow Image object
    img = Image.open(screenshot)
    
    # Create a Pillow Draw object for drawing rectangles
    draw = ImageDraw.Draw(img)

    # Split the search phrase into words
    search_words = search_phrase.split()

    # Split the near matches text into words
    near_match_words = near_matches_text.split()

    for i, near_match_word in enumerate(near_match_words):
            # Check if the current word matches any word in the search phrase
            if any(search_word.lower() == near_match_word.lower() for search_word in search_words):
                # Get the bounding boxes for words
                word_boxes = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
                for j, text in enumerate(word_boxes['text']):
                    
                    if text.lower() == near_match_word.lower():
                        left, top, width, height = word_boxes['left'][j], word_boxes['top'][j], word_boxes['width'][j], word_boxes['height'][j]
                        
                        # Draw a red outline around the matching word
                        draw.rectangle([left, top, left + width, top + height], outline="red")

    # Save the modified screenshot
    img.save(screenshot, format="PNG")

def process_page_with_ocr(page):
    # Convert the page to an image using PyMuPDF
    image = page.get_pixmap()

    # Convert the image to a format that can be processed by pytesseract
    image_pil = Image.frombytes("RGB", (image.width, image.height), image.samples)

    # Use pytesseract to perform OCR on the image
    ocr_text = pytesseract.image_to_string(image_pil, lang='eng')

    return ocr_text                                            
            
@app.route('/assets/<filename>')
def serve_image(filename):
    # Serve image from the specified directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/search-pdf", methods=["POST"])
def search_pdf():
    if request.method == 'POST':
        # Parse request data to get PDF path & query term
        pdf_path = request.files['pdfPath'].read()
        search_phrase = request.form['searchPhrase']

        if search_phrase:
            print(search_phrase)
            # Check asset folder exists & isn't empty
            if os.path.exists(app.config['UPLOAD_FOLDER']) and os.listdir(app.config['UPLOAD_FOLDER']):
                # Clear assets folder
                try:
                    for root, dirs, files in os.walk(app.config['UPLOAD_FOLDER']):
                        for file in files:
                            file_path = os.path.join(root, file)
                            os.remove(file_path)
                        for dir in dirs:
                            dir_path = os.path.join(root, dir)
                            os.rmdir(dir_path)
                except Exception as e:
                    return jsonify({'error': f'Error clearing assets folder: {str(e)}'}), 500

        matches = []  # Stores matched pages and text
        screenshots = []  # Stores screenshot file paths

        pdf_document = fitz.open(stream=pdf_path, filetype="pdf")

        for page_number in range(pdf_document.page_count):
            page = pdf_document.load_page(page_number)
            print('in page search')
            try:
                text = page.get_text()
                print('nonocr')
                # If PyMuPDF extraction is unsuccessful (returns an empty string), try OCR (optical character recognition)
                if not text.strip():
                   print('ocr')
                   try:
                       text = process_page_with_ocr(page)
                   except Exception as e:
                       print('ocr error -- ' + e)
            except Exception as e:
                print(e)
                return jsonify({'error': 'Error parsing PDF'}), 500

            # Initialize a flag to check if a match is found
            match_found = False

            # Process the text content dynamically (replace this with your data source)
            # In this example, we split the text into words and process each word
            words = text.split()
            for word in words:
                # Calculate the similarity score between search_phrase and the word
                similarity_score = fuzz.partial_ratio(search_phrase, word)

                # Set a minimum similarity score threshold (adjust as needed)
                min_similarity_score = 80

                if similarity_score >= min_similarity_score:
                    match_found = True
                    break  # Stop searching once a match is found

            if match_found:
                matches.append((page_number, text))

        # if there's nothing in matches array, stop execution and print no matches found
        if not matches:
           return jsonify({'error': 'No matches found'}), 500     
        
        for match_page_number, match_text in matches:
            page = pdf_document.load_page(match_page_number)
            img = page.get_pixmap()

            width = img.width
            height = img.height

            screenshot = Image.frombytes("RGB", [width, height], img.samples)
            print('building image match')
            # Generate unique filename for each screenshot
            screenshot_filename = f"match_page_{match_page_number + 1}.png"
            screenshot_filepath = os.path.join(app.config['UPLOAD_FOLDER'], screenshot_filename)
            print(screenshot_filepath)
            draw = ImageDraw.Draw(screenshot)
            text_instances = []
            text_instances_ocr = ''
            if page.search_for(search_phrase):
                text_instances = page.search_for(search_phrase)
            else:
                text_instances_ocr = process_page_with_ocr(page)
           
            screenshot.save(screenshot_filepath)
            # Highlight near matches in the screenshot
            if len(text_instances) > 0:
                for inst in text_instances:
                    x0, y0, x1, y1 = inst
                    draw.rectangle([x0, y0, x1, y1], outline="red")
                screenshot.save(screenshot_filepath)
            elif text_instances_ocr:
                highlight_exact_matches(screenshot_filepath, search_phrase, text_instances_ocr)
            else:
                highlight_exact_matches(screenshot_filepath, search_phrase, match_text)
            
            screenshots.append(screenshot_filepath)

        pdf_document.close()

        return jsonify({"matches": matches, "screenshots": screenshots}) # {matches:[[num, "cont"]], screenshots:[""]}
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
