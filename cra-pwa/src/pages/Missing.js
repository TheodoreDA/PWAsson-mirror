import { Link } from "react-router-dom";

function Missing() {
    return (
        <div>
            <h1>Page Introuvable</h1>
            <Link to="/feed">Retour</Link>
        </div>
    );
}

export default Missing;