import {
  F,
  S,
  R,
  C,
  live,
  rows,
  byId,
  unique,
  required,
  minor,
  amount,
  interval,
  noOverlap,
  changed,
  immutable,
  admin,
  totalLines,
  summary,
  clock,
  label,
} from "./core/rules.js";
const definition = {
  slug: "routeboard",
  reference: 56,
  title: "RouteBoard",
  description:
    "Личный журнал вакансий, этапов и следующих действий. Отправка откликов остаётся отдельным действием человека.",
  limitations:
    "Одна организация · Собственный сервер · Ручной ввод · Без банковских и внешних интеграций",
  collections: [
    C("jobs", "Вакансии", [
      F("title", "Должность"),
      F("company", "Компания"),
      F("url", "Ссылка", "url"),
      S("stage", "Этап, отмеченный вручную", [
        ["saved", "Сохранено"],
        ["applied", "Отклик отмечен"],
        ["interview", "Собеседование"],
        ["offer", "Предложение"],
        ["rejected", "Отказ"],
        ["closed", "Закрыто"],
      ]),
    ]),
    C("tasks", "Действия", [
      R("job", "Вакансия", "jobs"),
      F("action", "Следующий шаг"),
      F("due", "Срок", "date"),
      S("status", "Статус", [
        ["open", "Открыто"],
        ["done", "Выполнено"],
      ]),
    ]),
  ],
  validate(state, before, command, actor) {
    unique(live(state, "jobs"), "url", "Вакансия");
    for (const t of live(state, "tasks")) {
      const job = byId(state, "jobs", t.job);
      required(
        !job.archived || t.status === "done",
        "Сначала завершите открытые действия перед архивированием вакансии.",
      );
    }
    for (const job of rows(state, "jobs"))
      if (job.archived)
        required(
          !live(state, "tasks").some(
            (t) => t.job === job.id && t.status === "open",
          ),
          "Есть открытые действия.",
        );
  },
  summarize(state) {
    return live(state, "jobs").map((job) =>
      summary(
        job.company + " · " + job.title,
        "Этап пользователя: " + label(definition, "jobs", "stage", job.stage),
        ...live(state, "tasks")
          .filter((t) => t.job === job.id && t.status === "open")
          .map((t) => t.due + " · " + t.action),
        "Запись статуса не доказывает фактическую отправку отклика.",
      ),
    );
  },
};
export default definition;
