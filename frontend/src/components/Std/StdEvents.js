import { useState } from "react";
import { Tabs } from "@mantine/core";
import "../../styles/index.css";
import LargeCalendar from "./LargeCalendar"; 

export default function StdEvents() {

    return (
        <div>
            <h2>Event Manager</h2>

            {/* Calendar */}
            <div id="CalendarDiv">
                <LargeCalendar />
            </div>

        </div>
    );
}
