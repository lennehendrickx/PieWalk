type SchedulerParameters = {
    predicate: () => boolean;
    callback: () => void;
    interval: number;
};

const scheduleWhile = ({
    predicate = () => true,
    callback,
    interval = 100,
}: SchedulerParameters) => {
    let lastRun = 0;
    const scheduleWhileTrue = () => {
        if (predicate()) {
            requestAnimationFrame((time) => {
                if (time - lastRun > interval) {
                    callback();
                    lastRun = time;
                }
                scheduleWhileTrue();
            });
        }
    };

    scheduleWhileTrue();
};

export default scheduleWhile;
