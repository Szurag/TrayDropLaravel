<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>TrayDrop!</title>

</head>
<body>
<h1>TrayDrop!</h1>

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    const token = "5|C90MaccVt1pEBWtKNh9nrHVab15Dj7dnCsiEkJrj";
    const evtSource = new EventSource(`/api/files/updates?_token=${token}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    evtSource.onmessage = (event) => {
        console.log(event.data);
    }

</script>
</body>
</html>
