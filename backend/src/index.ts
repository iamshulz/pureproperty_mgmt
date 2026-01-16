import express from "express";
import agentRoutes from "./routes/agent.routes";
import propertyRoutes from "./routes/property.routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/agents", agentRoutes);
app.use("/properties", propertyRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});