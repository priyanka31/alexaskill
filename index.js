var devices = {
 "echo" : {
    "about" : "voice based virtual assistant by amazon powered by Alexa",
    "price" : "$179"
 },
 "homepod" : {
    "about" : "apple's smart speaker powered by siri",
    "price" : "$349"
    },
 "home" :{
    "about" : "google's voice controlled personal assistant",
    "price" : "$129"
 }
}

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
                    
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here

    if(intentName == "DevicesIntent"){
        handleDevicesResponse(intent , session , callback)
    }
    else if(intentName == "AMAZON.HelpIntent"){
        handleGetHelpRequest(intent, session, callback)
    }
    else if(intentName == "AMAZON.YesIntent"){
        handleYesResponse(intent, session, callback)
    }
    else if(intentName == "AMAZON.NoIntent"){
        handleNoResponse(intent, session, callback)
    }
    else if(intentName == "AMAZON.StopIntent"){
        handleGetHelpRequest(intent, session, callback)
    }
    else if(intentName == "AMAZON.CancelIntent"){
        handleGetHelpRequest(intent, session, callback)
    }


}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Smart Device guide. Currently, there are 3 major rivals in the area of smart voice based assistance namely Amazon Alexa, Google Home and Apple HomePod" +
     "i can tell you all about them." + 
     "Which one would you like to get started with?"

     var reprompt = "Which smart assistant would you like to know about?" + "Amazon Alexa, Google Home or Apple HomePod"

     var header = "smart assistant guide"
     var shouldEndSession = false

     var sessionAttributes = {          //session attr contains something that we want to keep in our memory throughout.
        "speechOutput" : speechOutput ,
        "repromptText" : reprompt
     }
     callback(sessionAttributes, buildSpeechletResponse(header, speechOutput,reprompt,shouldEndSession))
}


function handleDevicesResponse(intent , session , callback){

    var device = intent.slots.devices.value.toLowerCase()

    if(!devices[device]){

        var speechOutput = "I am unaware of that device!"
        var repromptText = "Ask about another device"
        var header = "Unknown device"
    }
    else{
        var about = devices[device].about
        var price = devices[device].price
        var speechOutput = device + " is " + about + "and it's price is " + price
        var repromptText = "Do you want information on other devices?"
        var header = device
    }
    var shouldEndSession = false
    callback(session.attributes , buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};

}
    var speechOutput= "This is Smart Device guide. Currently, there are 3 major rivals in the area of smart voice based assistance" +
     "namely Amazon Alexa ,Google Home and Apple HomePod. Which one would you like to know about?"
     var repromptText = speechOutput
     var shouldEndSession = false
     
     callback(session.attributes , buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))

}

function handleYesResponse(intent, session, callback){
    var speechOutput= "Okay, which device you need information on? Echo , Home or HomePod"
    var repromptText = "Okay, which device you need information on? Echo , Home or HomePod"
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleNoResponse(intent, session, callback){

    handleFinishSessionRequest(intent, session, callback)
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using Smart Device Guide", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}