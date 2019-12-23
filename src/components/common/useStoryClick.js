import { useHistory, useRouteMatch } from "react-router";
export default function useStoryClick() {
  const history = useHistory();
  const match = useRouteMatch();
  function click(story) {
    const { _key, type, openType, url } = story;
    switch (type) {
      case 12:
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&key=${_key}`,
          "_blank"
        );
        break;
      case 15:
        if (openType === 1) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
        break;
      default: {
        const path = type === 9 ? "article" : "story";
        history.push({
          pathname: `/${match.params.id}/${path}`,
          search: `?key=${_key}`
        });
        break;
      }
    }
  }
  return click;
}
