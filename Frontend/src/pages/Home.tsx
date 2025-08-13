import { Button } from 'primereact/button'
import { useToast } from '../contexts/ToastContext'

const Home = () => {
    const { toast } = useToast()

    return (
        <Button
            label='Show Toast'
            severity='success'
            className='align-self-center'
            onClick={() =>
                toast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Message Details',
                    sticky: true
                })
            }
        />
    )
}

export default Home