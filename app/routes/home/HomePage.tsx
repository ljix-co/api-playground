import React from 'react';
import type { Route } from './+types/HomePage';
import RequestComposerSection from './RequestComposerSection';
import ServiceProvider from '../../services/ServiceProvider';
import ResponseSection from './ResponseSection';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'API Playground' },
    ];
}

const HomePage: React.FC = () => {
    return (
        <ServiceProvider>
            <div className='layout-page'>
                <h1 className="mb-4 text-2xl font-bold">Welcome to API Playground</h1>
                <p className="text-gray-700">
                    This is a simple application to test and explore APIs. Use the form below to send requests and see responses in real-time.
                </p>
                <RequestComposerSection />
                <ResponseSection />
            </div>
        </ServiceProvider>
    );
};

export default HomePage;
