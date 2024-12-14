import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import useGetAxiosApi from '../Hooks/useGetAxiosApi';
import '../Services/style/books.css';
import { ProgressSpinner } from 'primereact/progressspinner';
// import { Rating } from 'primereact/rating';
// import { Tag } from 'primereact/tag';


const Books = () => {
    
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');

    const { data, loading, error, refetch } = useGetAxiosApi('books');
    
    useEffect(() => {
        setBooks(data)
    }, [data]) 

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        )
    }
    if (error) {
        return (
            <div className="card flex justify-content-center">
            <p>לצערינו אין ספרים זמינים במלאי</p>
            </div>
        )
    }
 
    const listItem = (book) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${book.image}`} alt={book.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{book.name}</div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Button severity="secondary" icon="pi pi-shopping-cart" className="p-button-rounded" disabled={book.inventoryStatus == 'OUTOFSTOCK'}></Button>
                        </div>
                    </div>
                </div>
            </div>);
    };

    const gridItem = (book) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`https://primefaces.org/cdn/primereact/images/product/${book.image}`} alt={book.name} />
                        <div className="text-2xl font-bold">{book.name}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Button severity="secondary" icon="pi pi-shopping-cart" className="p-button-rounded" disabled={book.inventoryStatus == 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (book, layout) => {
        if (!book) {
            return;
        }

        if (layout == 'list') return listItem(book);
        else if (layout == 'grid') return gridItem(book);
    };

    return (
        <div className="card opacity-90 m-1">
            <DataView severity="secondary" value={books} itemTemplate={itemTemplate} layout={layout} />
        </div>
    )
}

export default Books;
