import { useRef, useEffect } from 'react';

import Card from '../UI/Card';
import ListItem from './ListItem';

import s from './ResultsList.module.scss';

const ResultsList = (props) => {
    let { items, imgs } = props.data;

    let listRef = useRef(null);

    useEffect(() => {
        listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [items]);

    return (
        <Card className={s.results_card}>
            <div className={`${s.results_wrapper} ${items.length > 5 && s.overflow}`} ref={listRef}>
                <ul className={s.results_container}>
                    {items.map((item, i) => {
                        // item => [num, ""]
                        const [num, str] = item;

                        return <ListItem 
                                key={i} 
                                pageNum={num} 
                                text={str} 
                                img={{ url: imgs[i], alt: `Image ${i + 1}` }} 
                                />;
                    })}
                </ul>
            </div>
        </Card>
    );
}

export default ResultsList;