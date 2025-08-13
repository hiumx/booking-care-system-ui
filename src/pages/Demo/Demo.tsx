import COMPONENTS from './list-components';

const Demo = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '12px' }}>List of components</h1>
            {COMPONENTS.map((component, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <h4>{`${index + 1}. ${component.title}`}</h4>
                    <p style={{ color: '#666' }}>{component.description}</p>
                    <component.component {...component.mockData} />
                </div>
            ))}
        </div>
    );
};

export default Demo;
