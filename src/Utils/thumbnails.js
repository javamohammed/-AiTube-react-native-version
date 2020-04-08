export default {
    getThumbnail(idVid, size){
        const defaultCase = {
            "url": `https://i.ytimg.com/vi/${idVid}/default.jpg`,
            "width": 120,
            "height": 90
        }
        switch (size) {
            case "default":
                return defaultCase
            case "medium":
                return {
                    "url": `https://i.ytimg.com/vi/${idVid}/mqdefault.jpg`,
                    "width": 120,
                    "height": 90
                }
            case "high":
                return {
                    "url": `https://i.ytimg.com/vi/${idVid}/hqdefault.jpg`,
                    "width": 120,
                    "height": 90
                }
            case "standard":
                return {
                    "url": `https://i.ytimg.com/vi/${idVid}/sddefault.jpg`,
                    "width": 120,
                    "height": 90
                }
            default:
                return defaultCase
        }
    }
}