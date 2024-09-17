import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import axios from 'axios';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const DataTableComponent: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchArtworks = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const { data, pagination } = response.data;

            const artworksData = data.map((artwork: any) => ({
                id: artwork.id,
                title: artwork.title,
                place_of_origin: artwork.place_of_origin,
                artist_display: artwork.artist_display,
                inscriptions: artwork.inscriptions,
                date_start: artwork.date_start,
                date_end: artwork.date_end,
            }));

            setArtworks(artworksData);
            setTotalPages(pagination.total_pages);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(page); // Fetch artworks on component load and page change
    }, [page]);

    const onPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const itemTemplate = (artwork: Artwork) => {
        return (
            <div className="col-12" key={artwork.id}>
                <div className="p-4 border-round shadow-2 surface-border">
                    <div className="text-2xl font-bold">{artwork.title}</div>
                    <div className="text-gray-600">
                        <strong>Place of Origin:</strong> {artwork.place_of_origin}
                    </div>
                    <div className="text-gray-600">
                        <strong>Artist Display:</strong> {artwork.artist_display}
                    </div>
                    <div className="text-gray-600">
                        <strong>Inscriptions:</strong> {artwork.inscriptions || 'N/A'}
                    </div>
                    <div className="text-gray-600">
                        <strong>Date Range:</strong> {artwork.date_start} - {artwork.date_end}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1>Artworks Data</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DataView value={artworks} itemTemplate={itemTemplate} paginator rows={5} />

                    <div className="flex justify-content-between align-items-center mt-4">
                        <Button
                            label="Previous"
                            icon="pi pi-arrow-left"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        />
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            label="Next"
                            icon="pi pi-arrow-right"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default DataTableComponent;
