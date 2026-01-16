import express from "express";
import agentRoutes from "./routes/agent.routes";
import propertyRoutes from "./routes/property.routes";
import familyRoutes from "./routes/family.routes";
import tenantRoutes from "./routes/tenant.routes";
import noteRoutes from "./routes/note.routes";
import remindersRoutes from "./routes/reminders.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/agents", agentRoutes);
app.use("/properties", propertyRoutes);
app.use("/families", familyRoutes);
app.use("/tenants", tenantRoutes);
app.use("/notes", noteRoutes);
app.use("/reminders", remindersRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});