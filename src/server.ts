import app from "./app";
import { connectDatabase } from "./config/database";

const port = process.env.PORT || 5000;

connectDatabase();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


