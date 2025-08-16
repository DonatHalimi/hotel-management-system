import { useQuery } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'

type Post = {
    userId: number
    id: number
    title: string
    body: string
}

const Post = () => {
    const navigate = useNavigate();
    const { data, isFetching } = useQuery<Post, Error>({
        queryKey: ['post'],
        queryFn: async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
            if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`)
            return res.json()
        },
    })

    return (
        <div>
            <Button onClick={() => navigate('/')}>Home</Button>
            <h3>{data?.title}</h3>
            <p>{data?.body}</p>
            {isFetching && <p>Fetching...</p>}
        </div>
    )
}

export default Post;