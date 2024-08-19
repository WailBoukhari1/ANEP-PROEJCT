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
                        <h1 style={{ margin: 0, fontSize: '2em', color: '#333' }}>Mot de la Directrice Générale</h1>
                        <p style={{ fontSize: '1.2em', color: '#666' }}>
                            L'Agence Nationale des Equipements Publics « ANEP » constitue le prolongement de la Direction des Equipements Publics et le couronnement des efforts louables déployés, pendant plus de 40 ans, par ses femmes et ses hommes pour le développement du métier de la Maîtrise d’Ouvrage Déléguée (MOD).                        </p>
                        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                            Aujourd’hui, elle accompagne une soixantaine de maîtres d’ouvrages publics, dont des départements ministériels, un certain nombre de collectivités locales, d’établissements publics et d’associations à but non lucratifs pour la réalisation de leurs programmes/ projets de constructions publiques.
                        </p>
                        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                            Nous sommes fiers d’avoir contribué continûment, avec dévouement et abnégation, à la promotion du secteur bâtiment et par conséquent au développement socio-économique de notre pays.
                        </p>
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        En tant qu’institution engagée auprès de ses partenaires maîtres d’ouvrages publics et professionnels de l’acte de bâtir, et grâce à ses ressources humaines poly disciplinaires et sa représentativité régionale, l’ANEP se positionne comme leader dans son champ d’activité. Elle a à son actif plusieurs projets d’envergure : des équipements sportifs aux normes internationales, des centres hospitaliers universitaires de qualité irréprochable, des équipements culturels de grande ampleur, des plateformes aéroportuaires de haut niveau, des universités de renommée euro-méditerranéenne, des bâtiments administratifs grandioses et des bâtiments et centres sociaux…
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        Dans les circonstances actuelles, et partant de ses orientations stratégiques et de sa vision de développement à l’horizon 2035, l’ANEP ambitionne de se positionner comme un référent national incontournable, dans son champ d’activité, aussi bien pour l’édification de nouveaux équipements publics sur tout le territoire national, avec la qualité et la sécurité requises, au moindre coût et dans les délais impartis tout en veillant sur les normes de développement durable, que pour la maintenance et la préservation du patrimoine bâti de l’Etat.
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        Nous nous réjouissons, aujourd’hui, de rappeler l’histoire de notre entité à laquelle nous avons tous participé en collaboration avec nos partenaires maîtres d’ouvrages publics (MOP) et professionnels… une histoire qui met en lumière les défis immédiats et futurs auxquels nous sommes confrontés mais aussi et surtout les mutations décisives qui s’annoncent et auxquelles nous devons être prêts.
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        Qualité, efficacité, technicité, professionnalisme, écoute, compétitivité, esprit d’équipe, proximité… sont autant de valeurs que nous partageons à l’ANEP et qui, de nos jours, sont plus que jamais indispensables et primordiales pour profiter des opportunités qui s’offrent à nous et nous permettent de rehausser le niveau de notre savoir-faire afin de le valoriser au Maroc et à l’international.
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        L’un des atouts de notre agence réside dans son capital humain riche avec des profils multiples qui se retrouvent autour d’un objectif commun à savoir celui de renforcer la compétitivité et l’efficience de l’ANEP.
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px', lineHeight: '1.6' }}>
                        D’ores et déjà, le futur s’annonce encourageant et engageant au même titre que les relations que nous entretenons avec toutes nos parties prenantes. Avec elles et pour elles, nous nous évertuerons à développer de nouveaux ressorts de la croissance. Nous continuerons à satisfaire les exigences de nos clients et nous mettrons notre savoir-faire et l’expertise que nous avons pu capitaliser à leur service. Cela nous permettra de consolider notre positionnement en tant qu’outil de l’Etat dans le domaine de la MOD. Il nous aidera, aussi, dans notre projet d’ouverture à l’international en exportant notre métier en Afrique.
                    </p>
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <p style={{ fontWeight: 'bold', color: '#333' }}>
                            Zineb BENMOUSSA<br />DG de l’ANEP
                        </p>
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
