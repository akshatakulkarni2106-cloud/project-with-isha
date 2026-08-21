import express from "express";
import authRoutes from "./routes/auth.routes"
import cookiePaser from "cookie-parser"

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cookiePaser());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.listen(PORT, () =>{

    console.log(`Server is running...on port ${PORT}`);
});