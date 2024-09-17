import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import axios from 'axios';
import 'primeicons/primeicons.css';

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
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [rows] = useState(10); // Number of rows per page
    const [selectedArtworks, setSelectedArtworks] = useState<{ [key: number]: boolean }>({});
    const [selectAll, setSelectAll] = useState(false);
    const [customText, setCustomText] = useState(''); // Text for overlay panel
    const op = useRef<OverlayPanel>(null); // Ref for the overlay panel

    const fetchArtworks = async (page: number, rows: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const { data, pagination } = response.data;

            const artworksData = data.map((artwork: any) => ({
                id: artwork.id,
                title: artwork.title,
                place_of_origin: artwork.place_of_origin,
                artist_display: artwork.artist_display,
                inscriptions: artwork.inscriptions || 'N/A',
                date_start: artwork.date_start || 'N/A',
                date_end: artwork.date_end || 'N/A',
            }));

            setArtworks(artworksData);
            setTotalRecords(pagination.total);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(1, rows); // Initial load, first page
    }, []);

    const onPageChange = (event: any) => {
        setFirst(event.first);
        fetchArtworks(event.page + 1, event.rows); // Fetch new data on page change
    };

    const onRowSelectChange = (rowData: Artwork, checked: boolean) => {
        setSelectedArtworks((prevSelected) => ({
            ...prevSelected,
            [rowData.id]: checked,
        }));
    };

    const onSelectAllChange = (e: any) => {
        const isChecked = e.checked;
        const updatedSelection = { ...selectedArtworks };

        artworks.forEach((artwork) => {
            updatedSelection[artwork.id] = isChecked;
        });

        setSelectedArtworks(updatedSelection);
        setSelectAll(isChecked);
    };

    const rowSelectionTemplate = (rowData: Artwork) => {
        return (
            <Checkbox
                checked={!!selectedArtworks[rowData.id]}
                onChange={(e) => onRowSelectChange(rowData, e.checked || false)}
            />
        );
    };

    const handleSubmit = () => {
        const enteredIds = customText
            .split(',')
            .map((idStr) => parseInt(idStr.trim()))
            .filter((id) => !isNaN(id)); // Parse and filter valid IDs

        const updatedSelection = { ...selectedArtworks };

        // Select rows with entered IDs
        artworks.forEach((artwork) => {
            if (enteredIds.includes(artwork.id)) {
                updatedSelection[artwork.id] = true; // Mark row as selected
            }
        });

        setSelectedArtworks(updatedSelection); // Update the selection
        setCustomText(''); // Clear input after submission

        if (op.current) {
            op.current.hide(); // Hide overlay after submitting
        }
    };

    return (
        <div>
            <h1>Artworks Data</h1>

            <DataTable
                value={artworks}
                paginator
                lazy
                rows={rows}
                totalRecords={totalRecords}
                loading={loading}
                first={first}
                onPage={onPageChange}
                dataKey="id"
            >
                {/* Checkbox column for selection */}
                <Column
                    header={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox onChange={onSelectAllChange} checked={selectAll} />
                            <Button
                                type="button"
                                icon="pi pi-chevron-down"
                                onClick={(e) => op.current?.toggle(e)}
                                className="p-button-text"
                                style={{ marginLeft: '10px' }}
                            />
                        </div>
                    }
                    body={rowSelectionTemplate}
                    style={{ width: '3em' }}
                ></Column>

                <Column field="title" header="Title" sortable></Column>
                <Column field="place_of_origin" header="Place of Origin" sortable></Column>
                <Column field="artist_display" header="Artist Display" sortable></Column>
                <Column field="inscriptions" header="Inscriptions" sortable></Column>
                <Column field="date_start" header="Date Start" sortable></Column>
                <Column field="date_end" header="Date End" sortable></Column>
            </DataTable>

            {/* Overlay Panel with Text Field */}
            <OverlayPanel ref={op}>
                <div style={{ padding: '10px' }}>
                    <h3>Select Rows by ID</h3>
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Enter IDs (comma-separated)"
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <Button label="Submit" onClick={handleSubmit} />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default DataTableComponent;
