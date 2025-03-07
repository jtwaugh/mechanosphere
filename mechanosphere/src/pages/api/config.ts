import { NextApiRequest, NextApiResponse } from 'next';

let config = {
    startTime: 0,
    endTime: 100,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(config);
    } else if (req.method === 'POST') {
        const newConfig = req.body;
        if (newConfig.startTime !== undefined && newConfig.endTime !== undefined) {
            config = newConfig;
            res.status(200).json(config);
        } else {
            res.status(400).json({ error: 'Invalid configuration data' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}