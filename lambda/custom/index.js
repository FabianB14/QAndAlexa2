// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.score = 0;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        const speakOutput = 'Tell me what catagory of questions, how many questions you want to queue up and how difficult they should be. For catagories you may say geography, science, history or general. You may pick from 1 and 30 questions and you may choose easy, medium or hard.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// custom
const QuickGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuickGameIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Starting a quick game')
            // .addDelegateDirective('QueueUpQuestionIntent')
            .addDelegateDirective({
                name: 'GenerateQuestionQueue',
                confirmationStatus: 'NONE',
                slots: {
                    'NumberOfQuestions':'5',
                    'Difficulty':'medium'
                }
             })
            .getResponse();
    }
};
const GenerateQuestionQueueHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GenerateQuestionQueue'
    },
    handle(handlerInput) {
        var testQuestionObj = {
            'Question': 'True or False, is this working?',
            'CorrectAnswer': 'true'
        };
        var testArrayObj = [];
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.score = 0;
        const numOfQs = Alexa.getSlotValue(handlerInput.requestEnvelope, 'NumberOfQuestions');
        const difficulty = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Difficulty');
        const catagory = Alexa.getSlotValue(handlerInput.requestEnvelope, 'catagory');
        sessionAttributes.totalQs = numOfQs;
        for(var i = 0; i < numOfQs; i++) {
            testArrayObj.push(testQuestionObj);
        }
    sessionAttributes.ListOfQuestions = testArrayObj;//testQuestionObj;//testQuestionObj.Question + '||' + testQuestionObj.CorrectAnswer;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak('I have queued up ' + numOfQs + ' ' + difficulty + ' ' + catagory + ' questions. Say ready when you want me to ask a question.')
            .addDelegateDirective('QueueUpQuestionIntent')
            // .withEndSession(false)
            .getResponse();
    }
};
const QueueUpQuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QueueUpQuestionIntent'
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if(sessionAttributes.ListOfQuestions && sessionAttributes.ListOfQuestions.length > 0) {
            sessionAttributes.CorrectAnswer = sessionAttributes.ListOfQuestions[0].CorrectAnswer;
            sessionAttributes.Question = sessionAttributes.ListOfQuestions[0].Question;
            sessionAttributes.ListOfQuestions.shift();
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(sessionAttributes.Question + ' speak')
                .reprompt(sessionAttributes.Question)
                .addDelegateDirective('AnswerIntent')
                .getResponse();
        }
        else{
            return handlerInput.responseBuilder
                .speak('Your score is ' + sessionAttributes.score + ' correct answers out of ' + sessionAttributes.totalQs + ' total questions. If you would like to to play again just provide a number of questions and a difficulty.')
                // .addDelegateDirective('GenerateQuestionQueue')
                // .shouldEndSession(false)
                .getResponse();
        }
    }
};
const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent'
    },
    handle(handlerInput) {
        var nextIntent = 'QueueUpQuestionIntent';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const CorrectAnswer = sessionAttributes.CorrectAnswer;
        const Question = sessionAttributes.Question;
        const userAnswer = Alexa.getSlotValue(handlerInput.requestEnvelope, 'userAnswer');
        var speakOutput = 'You got it'
        if(userAnswer === CorrectAnswer) {
            speakOutput += ' right. Please say ready for the next question.';
            sessionAttributes.score++;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            nextIntent = 'QueueUpQuestionIntent';
        }
        else {
            speakOutput += ' wrong. Please say ready for the next question.';
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective(nextIntent)
            .getResponse();
    }
};
//
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        QuickGameIntentHandler,
        GenerateQuestionQueueHandler,
        QueueUpQuestionIntentHandler,
        AnswerIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
