import React from 'react';
import MainLayout from "../layout/MainLayout";

const MotDuDirecteur = () => {
    const buttonStyle = {
        display: 'block',
        width: '100%',
        padding: '15px',
        margin: '10px 0',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '1.2em',
        color: '#333',
        transition: 'background-color 0.3s'
    };

    return (
        <MainLayout>
            <div style={{
                padding: '40px',
                fontFamily: 'Arial, sans-serif',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '2px solid #e0e0e0',
                    paddingBottom: '20px'
                }}>
                    <img
                        src="https://www.anep.ma/sites/default/files/Screenshot%20from%202023-08-19%2017-58-46.png"
                        alt="Image ANEP"
                        style={{
                            width: '300px',
                            height: 'auto',
                            marginRight: '20px',
                            border: '2px solid #ccc',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    />
            </div>
        </MainLayout>
    );
};

export default MotDuDirecteur;
