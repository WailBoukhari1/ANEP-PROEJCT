import React from 'react';
import MainLayout from "../layout/MainLayout";

const MotDuDirecteur = () => {
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
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2em', color: '#333' }}>Mot du Directeur Général</h1>
                      
                    </div>
                </div>
                <div>
                   
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <p style={{ fontWeight: 'bold', color: '#333' }}>
                            Zineb BENMOUSSA<br />DG de l’ANEP
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MotDuDirecteur;
