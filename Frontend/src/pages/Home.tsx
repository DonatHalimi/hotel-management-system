import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext'
import { Button } from 'primereact/button'

const Home = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const showToast = () => {
        toast({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Message',
            life: 3000,
        });
    };

    return (
        <div>
            <Button onClick={() => navigate('/posts')}>Posts</Button>
            <div>
                <Button label="Show Toast" onClick={showToast}></Button>
            </div>
        </div>
    )
}

export default Home;