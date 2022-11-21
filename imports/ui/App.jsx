import React, {Fragment, useState} from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import {TaskForms} from "./TaskForms";
import { LoginForm } from './loginform';
import {useTracker} from "meteor/react-meteor-data";
import {TasksCollection} from "../api/tasks";

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [hideCompleted, setHideCompleted] = useState(false);
    const hideCompletedFilter = { isChecked: { $ne: true } };
    const userFilter = user ? { userId: user._id } : {};
    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    const tasks = useTracker(() => TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter,
        {sort: {createdAt: -1}}).fetch());

    const pendingTasksCount = useTracker(() => {
        if (!user) {
            return 0;
        }

        return TasksCollection.find(pendingOnlyFilter).count();
    });

    const pendingTasksTitle = `${
        
        pendingTasksCount ? ` (${pendingTasksCount})` : ''
    }`;

    const onCheckboxClick = (_id, isChecked) => {
        TasksCollection.update(_id, {
            $set: {
                isChecked: isChecked
            }
        })
    }

    const logout = () => Meteor.logout();

    const onDeleteClick = (_id) => {
        TasksCollection.remove(_id);
    }

    return (
        <div>
            {user ? (
                    <Fragment>
                        <div className="user" onClick={logout}>
                            {user.username} 🚪
                        </div>
                        <h1>
                            📝️ To Do List
                            {pendingTasksTitle}
                        </h1>
                        <div className="filter">
                            <button onClick={() => setHideCompleted(!hideCompleted)}>
                                {hideCompleted ? 'Show All' : 'Hide Completed'}
                            </button>
                        </div>
                        <TaskForms user={user}/>
                        <ul>
                            {tasks.map(t => <li key={t._id}>{t.text} <input
                                type="checkbox"
                                checked={t.isChecked}
                                onClick={() => onCheckboxClick(t._id, !t.isChecked)}
                                readOnly
                            />
                                <button onClick={() => onDeleteClick(t._id)}>Delete</button>
                            </li>)}
                        </ul>
                    </Fragment>
                ) :
                (<LoginForm/>)
            }
        </div>
    );
}

