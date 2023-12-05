
import Card from '../UI/Card';

import s from './Info.module.scss';

const Info = ({ err }) => {
    return (
        <Card className={`${s.Info_wrap} ${s.error}`}>
            <p>
                {err}
            </p>
        </Card>
    )
}

export default Info;