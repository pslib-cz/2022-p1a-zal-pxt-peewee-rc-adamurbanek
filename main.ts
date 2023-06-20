//jizda
radio.setGroup(54);
radio.setFrequencyBand(7);

const M1_MAX = 235;
const M4_MAX = 255;

radio.onReceivedString(function (receivedString: string) {
    let arr = [];
    arr.push(receivedString.charCodeAt(0)); // znak 1 - dimenze x
    arr.push(receivedString.charCodeAt(1)); // znak 2 - dimenze y

    for (let i = 2; i <= 7; i++) {
        arr.push(parseInt(receivedString.charAt(i)));
    }

    let x = Math.round((arr[0] / 255) * 2048 - 1024);
    let y = Math.round((arr[1] / 255) * 2048 - 1024);

    let x_scale = (Math.constrain(Math.abs(x), 250, 900) - 100) / 500;
    let y_scale = (Math.constrain(Math.abs(y), 250, 900) - 100) / 500;

    let M1Speed = 0;
    let M4Speed = 0;

    if (x < -150) {
        M1Speed += -M1_MAX * x_scale;
        M4Speed += M4_MAX * x_scale;
    } else if (x > 150) {
        M1Speed += M1_MAX * x_scale;
        M4Speed += -M4_MAX * x_scale;
    } if (y < -150) {
        M1Speed += M1_MAX * y_scale;
        M4Speed += M4_MAX * y_scale;
    } else if (y > 150) {
        M1Speed += -M1_MAX * y_scale;
        M4Speed += -M4_MAX * y_scale;
    }
    if (M1Speed != 0 || M4Speed != 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, Math.round(M1Speed / 2));
        PCAmotor.MotorRun(PCAmotor.Motors.M4, Math.round(M4Speed / 2));
    } else {
        PCAmotor.MotorStop(PCAmotor.Motors.M1);
        PCAmotor.MotorStop(PCAmotor.Motors.M4);
    }
})