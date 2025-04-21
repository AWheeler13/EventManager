import React, { useState, useEffect } from 'react';
import Map from './MapSearch'
import "../../styles/index.css";

export default function RSOCreateEvent () {
  
    return (
        <div id="OrgSearchPageDiv">
            <div >
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap" rel="stylesheet"></link>
            </div>

            <Map/>
        </div>
    );
}