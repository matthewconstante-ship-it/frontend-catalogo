import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-page-center">
            <div className="loader-wrapper">
                <div className="loader"></div>
                <span className="loader-letter">L</span>
                <span className="loader-letter">o</span>
                <span className="loader-letter">a</span>
                <span className="loader-letter">d</span>
                <span className="loader-letter">i</span>
                <span className="loader-letter">n</span>
                <span className="loader-letter">g</span>
                <span className="loader-letter">.</span>
                <span className="loader-letter">.</span>
                <span className="loader-letter">.</span>
            </div>
        </div>
    );
};

export default Loader;