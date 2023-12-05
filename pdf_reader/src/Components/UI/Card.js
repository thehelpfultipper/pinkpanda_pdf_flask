import s from './Card.module.scss';

const Card = (props) => {
    return (
        <div className={`${s.wrapper}${props.className ? ' ' + props.className : ''}`}>
            {props.children}
        </div>
    )
}


export default Card;