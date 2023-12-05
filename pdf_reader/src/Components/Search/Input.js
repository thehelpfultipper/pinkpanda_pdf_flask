import Card from "../UI/Card";
import CardTitle from './CardTitle';

import s from './Input.module.scss';

const Input = (props) => {
    const searchTermHandler = e => {
        let term = e.target.value;
        props.onSearch(term);
    }

    const enterHandler = e => {
        if (e.key === 'Enter') {
            props.onSubmit();
        }
    }

    const newUploadHandler = () => {
        props.ctx.setIsSelected(false);
        props.ctx.setIsError(false);
        props.ctx.setFile('');
    }

    return (
        <Card>
            <CardTitle />
            <div className={s.search_wrapper}>
                <input
                    type={props.type}
                    id={props.id}
                    className={`${s.action_item} ${s.search_input}`}
                    name={props.name}
                    value={props.value}
                    onChange={searchTermHandler}
                    onKeyDown={enterHandler}
                    placeholder="Search PDF..."
                />
                <div className={`${s.action_group}`}>
                    <button
                        className={`${s.action_item} ${s.btn}`}
                        onClick={newUploadHandler}
                    >New Upload</button>
                    <button
                        className={`${s.action_item} ${s.btn} ${s.search_btn}`}
                        onClick={props.onSubmit}
                    >Search PDF</button>
                </div>
            </div>
        </Card>
    );
}

export default Input;
