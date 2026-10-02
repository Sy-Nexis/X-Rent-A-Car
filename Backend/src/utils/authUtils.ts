import jwt from 'jsonwebtoken';

export function getReqUserInfo(req: any): { userName: string; userRole: string; userEmail: string } {
    let userName = (req.headers['x-user-name'] as string) || req.body?.user_name || req.body?.userName || (req.query?.user_name as string);
    let userRole = (req.headers['x-user-role'] as string) || req.body?.user_role || req.body?.userRole || (req.query?.user_role as string);
    let userEmail = (req.headers['x-user-email'] as string) || req.body?.user_email || req.body?.userEmail || (req.query?.user_email as string);

    if ((!userName || userName === 'Staff User') && req.headers?.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token) as any;
            if (decoded) {
                if (decoded.name) userName = decoded.name;
                if (decoded.role && (!userRole || userRole === 'Staff')) userRole = decoded.role;
                if (decoded.email && !userEmail) userEmail = decoded.email;
            }
        } catch {}
    }

    return {
        userName: userName || 'Staff User',
        userRole: userRole || 'Staff',
        userEmail: userEmail || ''
    };
}
