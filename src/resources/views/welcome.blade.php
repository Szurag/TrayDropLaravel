<!DOCTYPE html>
<html lang="pl">
<head>
    <title>Pusher Test</title>
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script>

        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher('9c026e72b56f8316ed63', {
            cluster: 'eu',
            channelAuthorization: {
                'endpoint': '/broadcasting/auth',
                headers: {
                    'Authorization': 'Bearer 1|P078CEs1XSu2bd0hmLMw1kR3bTqc44fa4FLx39tI'
                }
            },
        });

        var channel = pusher.subscribe('private-updates.1');
        channel.bind('files.clipboard.updated', function(data) {
            alert(JSON.stringify(data));
        });
    </script>
</head>
<body>
<h1>Pusher Test</h1>
<p>
    Try publishing an event to channel <code>my-channel</code>
    with event name <code>my-event</code>.
</p>
</body>
</html>

