export interface Reminder {
    id: string;
    agentId: string;
    propertyId: string;
    title: string;
    eventDate: Date;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}