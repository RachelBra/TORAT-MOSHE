import React from 'react'
import '../App.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';

const manuscripts = [
    { id: 1, title: 'כתב יד רמב"ם', image: '/images/manuscript1.jpg' },
    { id: 2, title: 'פירוש רש"י', image: '/images/manuscript2.jpg' },
    { id: 3, title: 'תלמוד בבלי', image: '/images/manuscript3.jpg' }
];

const Home = () => {
    return (
        <div className="p-grid p-justify-center p-mt-5">
            {/* כותרת ותיאור */}
            <div className="p-col-12 p-text-center">
                <h1 className="p-text-bold">גלה כתבי יד תורניים עתיקים</h1>
                <p>עיינו בכתבי יד לצד תמלולם, הציעו תיקונים, הוסיפו הערות והעמיקו בלימוד.</p>
                <Button label="לגלריית הכתבים" className="p-button-outlined p-mt-3" />
            </div>
            
            <Divider />
            
            {/* תצוגת כתבי יד */}
            <div className="p-col-12 p-text-center">
                <h2>כתבי היד באתר</h2>
            </div>
            <div className="p-grid p-justify-center">
                {manuscripts.map((manuscript) => (
                    <div key={manuscript.id} className="p-col-12 p-md-4">
                        <Card title={manuscript.title} className="p-shadow-3">
                            <Image src={manuscript.image} alt={manuscript.title} width="100%" preview />
                            <Button label="עיון בכתב היד" className="p-button-text p-mt-2" />
                        </Card>
                    </div>
                ))}
            </div>
            
            <Divider />
            
            {/* הסבר איך האתר עובד */}
            <div className="p-col-12 p-text-center">
                <h2>איך זה עובד?</h2>
                <ul className="p-text-left" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <li>📜 עיינו בכתבי יד עתיקים לצד תמלול</li>
                    <li>✍️ הציעו תיקונים לתמלול</li>
                    <li>💡 הוסיפו פרשנויות והערות</li>
                    <li>📩 צרו קשר ושאלו שאלות</li>
                </ul>
            </div>
            
            <Divider />
            
            {/* יצירת קשר */}
            <div className="p-col-12 p-text-center">
                <h2>צרו קשר</h2>
                <p>רוצים להוסיף כתב יד חדש או לשתף פעולה? נשמח לשמוע מכם!</p>
                <Button label="שלחו לנו הודעה" className="p-button-raised p-mt-2" />
            </div>
        </div>
    )
}

export default Home