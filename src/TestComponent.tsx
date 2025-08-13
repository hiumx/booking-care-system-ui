// This file demonstrates auto-fixing behavior
const TestComponent = () => {
    // This will be auto-fixed by ESLint
    const autoFixable = 'double quotes will be changed to single';

    return (
        <div>
            <h1>Test Component</h1>
            <p>This component demonstrates linting behavior: {autoFixable}</p>
        </div>
    );
};

export default TestComponent;
