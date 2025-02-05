import express from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = './server/data.json';

// Ladda in data från JSON-filen
const loadData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

let votes = loadData();

// Kontrollera om en IP-adress har röstat
const hasVoted = (ip) => votes.voters.includes(ip);

// API: Skicka in en röst
app.post('/vote', (req, res) => {
    const { option } = req.body;
    const ip = req.ip;

    if (hasVoted(ip)) return res.status(403).json({ message: 'Du har redan röstat!' });

    if (votes.options[option] !== undefined) {
        votes.options[option]++;
        votes.voters.push(ip);
        saveData(votes);
        return res.json({ message: 'Röst registrerad!' });
    }
    return res.status(400).json({ message: 'Ogiltigt alternativ!' });
});

// API: Hämta resultat
app.get('/results', (req, res) => {
    res.json(votes);
});

// API: Återställ röster (lösenordsskyddad)
app.post('/admin/reset', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Fel lösenord!' });

    votes.options = Object.fromEntries(Object.keys(votes.options).map(k => [k, 0]));
    votes.voters = [];
    saveData(votes);
    res.json({ message: 'Röster återställda!' });
});

// API: Uppdatera frågan
app.post('/admin/update-question', (req, res) => {
    const { password, question } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Fel lösenord!' });

    votes.question = question;
    saveData(votes);
    res.json({ message: 'Frågan har uppdaterats!' });
});

// API: Lägg till ett nytt svarsalternativ
app.post('/admin/add-option', (req, res) => {
    const { password, option } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Fel lösenord!' });

    if (votes.options[option]) return res.status(400).json({ message: 'Alternativet finns redan!' });

    votes.options[option] = 0;
    saveData(votes);
    res.json({ message: 'Alternativ tillagt!' });
});

// API: Ta bort ett svarsalternativ
app.post('/admin/remove-option', (req, res) => {
    const { password, option } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Fel lösenord!' });

    if (!votes.options[option]) return res.status(400).json({ message: 'Alternativet finns inte!' });

    delete votes.options[option];
    saveData(votes);
    res.json({ message: 'Alternativ borttaget!' });
});

// Starta servern
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
