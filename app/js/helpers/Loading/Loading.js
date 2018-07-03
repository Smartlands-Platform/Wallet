import { ClipLoader } from 'react-spinners';

export const Loading = ({loading}) => <div className='sweet-loading'>
    <ClipLoader
        color={'#000000'}
        loading={loading}
    />
</div>;