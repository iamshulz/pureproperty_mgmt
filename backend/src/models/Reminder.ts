export interface Reminder {
    id: string;
    agentId: string;
    propertyId: string;
    eventDate: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}