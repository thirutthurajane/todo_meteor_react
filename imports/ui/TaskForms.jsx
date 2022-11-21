import React, { useState } from "react";
import {TasksCollection} from "../api/tasks";

export const TaskForms = ({user}) => {

    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!text)
            return;

        TasksCollection.insert({
            text: text.trim(),
            createdAt: Date.now(),
            userId: user._id
        });

        setText("");
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type to add new tasks"
                onChange={(e) => setText(e.target.value)}
            />

            <button type="submit">Add Task</button>
        </form>
    );
}
