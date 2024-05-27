const Course = ({ course }) => {
    return (
        <>
            {course.map((z) => (
                <div key={z.id}>
                    <h2 key={z.id}>{z.name}</h2>
                    {z.parts.map((x) => (
                        <p key={x.id}>
                            {x.name} {x.exercises}
                        </p>
                    ))}
                    <b>
                        total of {z.parts.reduce((sum, part) => sum + part.exercises, 0)}{' '}
                        exercises
                    </b>
                </div>
            ))}
        </>
    );
};

export default Course;