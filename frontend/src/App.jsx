import { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";

import { getAllVectors } from "./api/vectorApi.js";
import Vectors from "./pages/Vectors.jsx";
import { VectorProvider } from "./context/VectorContext.jsx";
import Search from "./pages/Search.jsx";
import Benchmark from "./pages/Benchmark.jsx";
import Explore from "./pages/Explore.jsx";

function App() {
    const [vectors, setVectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllVectors()
            .then((res) => {
                setVectors(res.data.data);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <ThemeProvider>
      <VectorProvider>
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />

                <main className="main-content">
                    <Navbar />

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard
                                    vectors={vectors}
                                    loading={loading}
                                    error={error}
                                />
                            }
                        />
                        <Route path="/vectors" element={<Vectors />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/benchmark" element={<Benchmark />} />
                        <Route path="/explore" element={<Explore />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
        </VectorProvider>
        </ThemeProvider>
    );
}

export default App;