/*
 *
 * Edit Secret Name here  
 */
const SECRET_NAME = "YOUR_SECRET_NAME_HERE"

const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env[SECRET_NAME]}`
    }
};

// Define a mapping of state names to abbreviations
const stateAbbreviations = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
    'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
    'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
    'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
    'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
    'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
    'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH',
    'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
    'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY'
};

exports.main = async (event, callback) => {
    try {
        // Verify HubSpot API token by making a test request
        const authResponse = await axios.get('https://api.hubapi.com/crm/v3/objects/companies', axiosConfig);

        if (authResponse.status !== 200) {
            console.error('Failed to authenticate with HubSpot API');
            return callback({ outputFields: { abbreviated_state: '' } });
        }

        // Get the state property from the company event
        const state = event.inputFields['state'];

        if (!state) {
            // If state is null or undefined, output an empty abbreviated_state
            return callback({ outputFields: { abbreviated_state: '' } });
        }

        // Convert the state to uppercase for comparison
        const upperState = state.toUpperCase().trim();

        // Check if the state is already an abbreviation
        if (Object.values(stateAbbreviations).includes(upperState)) {
            // If it's already abbreviated, output it as is
            return callback({ outputFields: { abbreviated_state: upperState } });
        }

        // Find the abbreviation for the state name
        const abbreviation = stateAbbreviations[upperState] || '';

        // Output the abbreviation or an empty string if not found
        callback({ outputFields: { abbreviated_state: abbreviation } });
    } catch (error) {
        console.error('Error processing state or authenticating:', error);
        callback({ outputFields: { abbreviated_state: '' } });
    }
};
