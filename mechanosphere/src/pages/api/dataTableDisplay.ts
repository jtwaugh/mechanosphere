import { NextApiRequest, NextApiResponse } from 'next';
import { dataTableDisplayService } from '@/services/dataTableDisplayService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const data = dataTableDisplayService.getData();
        res.status(200).json(data);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}