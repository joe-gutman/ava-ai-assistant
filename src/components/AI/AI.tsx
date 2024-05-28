'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button } from '../Button';
import SpeechToText from '../../utils/speechToText';
import SpeechBubble from './SpeechBubble/SpeechBubble';
import './AI.css';

function AI() {
    const [listening, setListening] = useState(false);
    const [messages, setMessages] = useState([
        { currentTime: 30, type: 'response', text: "Of course! Planning a vacation itinerary involves researching destinations, activities, accommodations, and transportation options. Let me know your preferences, budget, and travel dates, and I'll create a customized itinerary for you. Whether you're interested in sightseeing, outdoor adventures, or cultural experiences, I'll help you plan an unforgettable vacation." },
        { currentTime: 15, type: 'prompt', text: "Can you help me plan a vacation itinerary?" },
        { currentTime: 29, type: 'response', text: "Cooking the perfect steak involves several steps, including selecting high-quality meat, seasoning it properly, and cooking it to the desired level of doneness. You can grill, broil, pan-sear, or sous vide the steak depending on your preference. Be sure to let the steak rest before serving to allow the juices to redistribute evenly." },
        { currentTime: 14, type: 'prompt', text: "What's the best way to cook a steak?" },
        { currentTime: 28, type: 'response', text: "To change your privacy settings on social media, log in to your account and navigate to the settings or privacy section. From there, you can adjust various privacy settings such as who can see your posts, who can send you friend requests, and who can view your profile information. Be sure to review and customize your privacy settings regularly to protect your personal information." },
        { currentTime: 13, type: 'prompt', text: "How do I change my privacy settings on social media?" },
        { currentTime: 27, type: 'response', text: "Certainly! A highly recommended book to read is 'The Alchemist' by Paulo Coelho. It is a philosophical novel about self-discovery, destiny, and the pursuit of one's dreams. The book has been translated into numerous languages and has inspired millions of readers worldwide." },
        { currentTime: 12, type: 'prompt', text: "Can you recommend a good book to read?" },
        { currentTime: 26, type: 'response', text: "The population of Japan is approximately 126 million people. Japan is known for its dense population, advanced technology, and rich cultural heritage. The country has a diverse population with people from various ethnic backgrounds and regions." },
        { currentTime: 11, type: 'prompt', text: "What's the population of Japan?" },
        { currentTime: 25, type: 'response', text: "Improving productivity at work involves several strategies such as setting clear goals, prioritizing tasks, minimizing distractions, taking regular breaks, and delegating responsibilities when necessary. Additionally, using productivity tools and techniques such as time management apps, the Pomodoro Technique, and the Eisenhower Matrix can help increase efficiency." },
        { currentTime: 10, type: 'prompt', text: "How can I improve my productivity at work?" },
        { currentTime: 24, type: 'response', text: "Learning a new language requires dedication and practice. Some effective methods include immersing yourself in the language by watching movies, listening to music, and speaking with native speakers. Additionally, using language learning apps, attending classes, and practicing regularly can help improve your language skills." },
        { currentTime: 9, type: 'prompt', text: "What's the best way to learn a new language?" },
        { currentTime: 23, type: 'response', text: "Yes, I can help you schedule a meeting for next Monday. Let me know the date, time, and agenda for the meeting, and I'll take care of the rest. Alternatively, you can use scheduling software or a calendar app to schedule the meeting yourself." },
        { currentTime: 8, type: 'prompt', text: "Can you schedule a meeting for next Monday?" },
        { currentTime: 22, type: 'response', text: "To format a document in Microsoft Word, you can use various formatting options such as font styles, sizes, colors, alignment, and spacing. You can access these options from the 'Home' tab in the toolbar. Additionally, you can apply pre-defined styles and templates to your document for a professional look." },
        { currentTime: 7, type: 'prompt', text: "How do I format a document in Microsoft Word?" },
        { currentTime: 21, type: 'response', text: "The capital of France is Paris. It is known for its iconic landmarks such as the Eiffel Tower, Notre-Dame Cathedral, and Louvre Museum. Paris is also famous for its art, culture, and cuisine." },
        { currentTime: 6, type: 'prompt', text: "What's the capital of France?" },
        { currentTime: 20, type: 'response', text: "Let's troubleshoot your computer. What seems to be the problem? Common issues include slow performance, software errors, and hardware malfunctions. Let's start by checking for software updates and running a diagnostic test." },
        { currentTime: 5, type: 'prompt', text: "I need help troubleshooting my computer." },
        { currentTime: 19, type: 'response', text: "Certainly! A highly recommended restaurant nearby is 'La Trattoria.' It offers authentic Italian cuisine in a cozy atmosphere. Be sure to try their signature dishes such as homemade pasta, wood-fired pizzas, and tiramisu for dessert. The restaurant is known for its excellent service and welcoming ambiance, making it a perfect choice for a delicious meal." },
        { currentTime: 4, type: 'prompt', text: "Could you recommend a good restaurant nearby?" },
        { currentTime: 18, type: 'response', text: "The top news headlines today include updates on global events, politics, economy, technology, sports, and entertainment. You can stay informed by visiting reputable news websites, watching news broadcasts, and following credible journalists and news outlets on social media. Remember to verify information from multiple sources to ensure accuracy." },
        { currentTime: 3, type: 'prompt', text: "What are the top news headlines today?" },
        { currentTime: 17, type: 'response', text: "Setting up a new email account is simple. You can choose from various email service providers such as Gmail, Outlook, Yahoo Mail, and others. Visit the website of your preferred email provider, click on the 'Sign Up' or 'Create Account' button, and follow the prompts to create a new email address. Be sure to choose a secure password and configure your account settings according to your preferences." },
        { currentTime: 2, type: 'prompt', text: "How do I set up a new email account?" },
        { currentTime: 16, type: 'response', text: "For weather updates tomorrow, you can use weather forecasting websites or apps such as The Weather Channel, AccuWeather, or Weather.com. These platforms provide up-to-date information on temperature, precipitation, wind speed, and other weather conditions for your location. You can also enable notifications to receive alerts about weather changes throughout the day." },
        { currentTime: 1, type: 'prompt', text: "Can you provide weather updates for tomorrow?" }
    ]);  
    const [currentMessage, setCurrentMessage] = useState({})
    
    let stt = useRef(null);

    useEffect(() => {
        stt.current = new SpeechToText(saveTranscription);
    }, []);

    useEffect(() => {
        console.log('Messages: ', messages);
    }, [messages])

    // Creates a new message object
    const createMessage = (text, type) => {
        return {
            currentTime: Date.now(),
            type,
            text
        };
    };

    // Saves the transcription and updates state accordingly
    const saveTranscription = (transcript, speechEnd) => {
        if (transcript) {
            if (!speechEnd && transcript.length > 0) {
                setCurrentMessage(createMessage(transcript, 'prompt'));
            } else if (speechEnd && transcript.length > 0) {
                const newMessage = createMessage(transcript, 'prompt');
                updateMessages(newMessage);
                setCurrentMessage({});
                setListening(false);
            } else {
                setListening(false);
            }
        }
    };

    // Submits the user's typed message
    const submitText = () => {
        const textInput = document.getElementById('prompt-text-input');
        const text = textInput.value;
        const newMessage = createMessage(text, 'prompt');
        updateMessages(newMessage);
    };

    // Toggles speech-to-text functionality
    const toggleSpeechToText = () => {
        if (!listening) {            
            setListening(true);
            stt.current.start();
        } else {
            setListening(false);
            stt.current.stop();
        }
    };

    // Updates the messages state
    const updateMessages = (newMessage) => {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
    };

    return (
        <div className='ai-container'>
            <div className='background-blend' />
            <div className='text-box'>
                {/* current message being spoken updated in real time */}
                {currentMessage && <SpeechBubble text={currentMessage.text} type={currentMessage.type}/>}
                {/* all messages, updated when current message is completed */}
                {messages.map((message, index) => (
                    <SpeechBubble key={index} text={message.text} type={message.type}/>
                ))}
            </div>
            <div className='input-container'>
                <input className='type-prompt' id='prompt-text-input' type='text'></input>
                <Button onClick={submitText}
                        backgroundColor='#64BE00'
                        textColor='white'
                        text='Submit'
                        width='15%'
                        name='submit-text'/>

                <Button onClick={toggleSpeechToText}
                        backgroundColor={listening? '#FA4B00' : '#64BE00'}
                        textColor='white'
                        text={listening? 'Stop Listening' : 'Start Listening'}
                        width='18%'
                        name='listening'/>
            </div>
        </div>
    );

}

export default AI;