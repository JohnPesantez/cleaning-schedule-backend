import express, {} from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';
const app = express();
app.use(express.json());
initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
});
const db = getFirestore();
app.get('/api/tasks', async (req, res) => {
    const snapshot = await db.collection('tasks').get();
    const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    res.json(tasks);
});
app.post('/api/tasks', async (req, res) => {
    const task = req.body;
    const docRef = await db.collection('tasks').add(task);
    res.json({
        id: docRef.id,
        ...task
    });
});
app.patch('/api/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const completedValue = req.body.completed;
    if (typeof id !== 'string') {
        return res.status(400).json({
            error: 'Invalid task ID'
        });
    }
    const docRef = await db.collection('tasks').doc(id).update({
        completed: completedValue
    });
    res.json({
        success: true
    });
});
app.delete('/api/tasks/:id', async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
        return res.status(400).json({
            error: 'Invalid task ID'
        });
    }
    await db.collection('tasks').doc(id).delete();
    res.json({
        success: true
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
//# sourceMappingURL=server.js.map