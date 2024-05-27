import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import "./server";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
    Button,
    Datepicker,
    Dropdown,
    Eventcalendar,
    Input,
    Popup,
    Segmented,
    SegmentedGroup,
    setOptions,
    Snackbar,
    Select,
    Switch,
    Textarea,
    Toast,
} from "@mobiscroll/react";
import "./App.css";
setOptions({
    theme: "ios",
    themeVariant: "light",
});

const now = new Date();

const defaultEvents = [
    {
        id: 1,
        start: "2024-05-08T13:00",
        end: "2024-05-24T13:45",
        title: "자양동",
        bufferBefore: 15,
        selectedPM: "이민규",
        selectedWorker: [
            "변우섭",
            "이승엽",
            "송건희",
            "송지호",
            "고정한",
            "박태환",
        ],
        color: "#009788",
    },
    {
        id: 2,
        start: "2024-05-14T15:00",
        end: "2024-05-24T16:00",
        title: "평촌",
        bufferBefore: 30,
        color: "#ff9900",
        selectedPM: "이민규",
        selectedWorker: ["변우섭", "이승엽", "송건희"],
    },
    {
        id: 3,
        start: "2024-05-03T18:00",
        end: "2024-06-23T22:00",
        title: "대전",

        bufferBefore: 60,
        selectedPM: "이민규",
        selectedWorker: ["변우섭", "이승엽", "송건희"],
        color: "#3f51b5",
    },
    {
        id: 4,
        start: "2024-05-11T10:30",
        end: "2024-05-25T11:30",
        title: "대구",
        selectedPM: "이민규",
        selectedWorker: ["변우섭", "이승엽", "송건희"],
        color: "#f44437",
    },
    {
        id: 5,
        start: "2024-05-11T10:30",
        end: "2024-05-25T11:30",
        title: "대구",
        selectedPM: "이민규",
        selectedWorker: ["변우섭", "이승엽", "송건희"],
        color: "#ffeb3c",
    },
];

const colors = [
    "#ffeb3c",
    "#ff9900",
    "#f44437",
    "#ea1e63",
    "#9c26b0",
    "#3f51b5",
    "",
    "#009788",
    "#4baf4f",
    "#7e5d4e",
];

function App() {
    const [events, setEvents] = useState(defaultEvents);
    const fetchEvents = () => {
        axios
            .get("/events")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("이벤트 가져오기 실패:", error);
            });
    };

    const [myEvents, setMyEvents] = useState(defaultEvents);
    const [tempEvent, setTempEvent] = useState(null);
    const [undoEvent, setUndoEvent] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [isToastOpen, setToastOpen] = useState(false);
    const [toastText, setToastText] = useState();
    const [isEdit, setEdit] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const [start, startRef] = useState(null);
    const [end, endRef] = useState(null);
    const [popupEventTitle, setTitle] = useState("");
    const [popupEventSelect, setSelect] = useState("");
    const [popupEventAllDay, setAllDay] = useState(true);
    const [popupTravelTime, setTravelTime] = useState(0);
    const [popupEventDate, setDate] = useState([]);
    const [popupEventStatus, setStatus] = useState("busy");
    const [mySelectedDate, setSelectedDate] = useState(now);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [colorAnchor, setColorAnchor] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [color, setColor] = useState("");
    const [tempColor, setTempColor] = useState("");
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);

    const [selectedPM, setSelectedPM] = useState(""); // 선택된 PM 값을 저장하는 상태 변수
    const [selectedWorker, setSelectedWorker] = useState([]); // 선택된 작업자 값을 저장하는 상태 변수

    const colorPicker = useRef();

    const myView = useMemo(
        () => ({
            calendar: {
                labels: true,
                popover: true,
                popoverClass: "custom-event-popover",
            },
        }),
        []
    );
    const addEventToServer = (eventData) => {
        axios
            .post("/events", eventData)
            .then((response) => {
                console.log("이벤트 추가 성공:", response.data);
                // 서버에 이벤트 추가 성공 시, 클라이언트의 이벤트 목록을 다시 불러옴
                fetchEvents(); // 이 함수는 서버로부터 이벤트 목록을 다시 가져오는 역할을 수행해야 함
                // 이는 useEffect에서 이미 사용 중인 메서드일 수 있습니다.
            })
            .catch((error) => {
                console.error("이벤트 추가 실패:", error);
            });
    };

    const updateEventOnServer = (eventData) => {
        axios
            .put(`/events/${eventData.id}`, eventData)
            .then((response) => {
                console.log("이벤트 수정 성공:", response.data);
                // 서버에 이벤트 수정 성공 시, 클라이언트의 이벤트 목록을 다시 불러옴
                fetchEvents(); // 이 함수는 서버로부터 이벤트 목록을 다시 가져오는 역할을 수행해야 함
            })
            .catch((error) => {
                console.error("이벤트 수정 실패:", error);
            });
    };

    const deleteEventFromServer = (eventId) => {
        axios
            .delete(`/events/${eventId}`)
            .then((response) => {
                console.log("이벤트 삭제 성공:", response.data);
                // 서버에 이벤트 삭제 성공 시, 클라이언트의 이벤트 목록을 다시 불러옴
                fetchEvents(); // 이 함수는 서버로부터 이벤트 목록을 다시 가져오는 역할을 수행해야 함
            })
            .catch((error) => {
                console.error("이벤트 삭제 실패:", error);
            });
    };
    const colorButtons = useMemo(
        () => [
            "cancel",
            {
                text: "Set",
                keyCode: "enter",
                handler: () => {
                    setSelectedColor(tempColor);
                    setColorPickerOpen(false);
                },
                cssClass: "mbsc-popup-button-primary",
            },
        ],
        [tempColor]
    );
    const handleToastClose = useCallback(() => {
        setToastOpen(false);
    }, []);
    const colorResponsive = useMemo(
        () => ({
            medium: {
                display: "anchored",
                touchUi: false,
                buttons: [],
            },
        }),
        []
    );

    const snackbarButton = useMemo(
        () => ({
            action: () => {
                setMyEvents((prevEvents) => [...prevEvents, undoEvent]);
            },
            text: "Undo",
        }),
        [undoEvent]
    );

    const handleSnackbarClose = useCallback(() => {
        console.log("Snackbar is closing"); // 디버깅용 로그
        setSnackbarOpen(false);
    }, []);
    const myData = [
        { text: "이민규", value: 1 },
        { text: "고정한", value: 2 },
        { text: "변우석", value: 3 },
        { text: "이승엽", value: 4 },
        { text: "송건희", value: 5 },
        { text: "박태환", value: 6 },
        { text: "송지호", value: 7 },
        { text: "김뿡뿡", value: 8 },
        { text: "이뿌리", value: 9 },
    ];

    const saveEvent = useCallback(() => {
        const newEvent = {
            id: tempEvent.id,
            title: popupEventTitle,
            // select: popupEventSelect,
            start: popupEventDate[0],
            end: popupEventDate[1],
            allDay: popupEventAllDay,
            bufferBefore: popupTravelTime,
            status: popupEventStatus,
            color: color,
            selectedPM: selectedPM, // 선택된 PM 값 추가
            selectedWorker: selectedWorker, // 선택된 작업자 값 추가
        };
        if (isEdit) {
            // update the event in the list
            const index = myEvents.findIndex((x) => x.id === tempEvent.id);
            const newEventList = [...myEvents];

            newEventList.splice(index, 1, newEvent);
            setMyEvents(newEventList);
            // here you can update the event in your storage as well
            // ...
        } else {
            // add the new event to the list
            setMyEvents([...myEvents, newEvent]);
            // here you can add the event to your storage as well
            // ...
        }
        setSelectedDate(popupEventDate[0]);
        // close the popup
        setOpen(false); // Reset selected PM and worker values
        setSelectedPM(""); // 선택된 PM 초기화
        setSelectedWorker([]); // 선택된 작업자 초기화
    }, [
        isEdit,
        myEvents,
        popupEventAllDay,
        popupEventDate,
        popupEventSelect,
        popupEventStatus,
        popupEventTitle,
        popupTravelTime,
        tempEvent,
        color,
        setSelectedDate,
        setOpen,
        setMyEvents,
        selectedPM,
        selectedWorker,
    ]);

    const deleteEvent = useCallback(
        (event) => {
            setMyEvents(myEvents.filter((item) => item.id !== event.id));
            setUndoEvent(event);
            setTimeout(() => {
                setSnackbarOpen(true);
            });
        },
        [myEvents]
    );
    const customEventContent = useCallback((data) => {
        const workerCount = data.original.selectedWorker
            ? data.original.selectedWorker.length
            : 0;
        return (
            <>
                <div>{data.title}</div>
                <div className="md-custom-event-cont">
                    <div className="mbsc-custom-event-name">
                        <b> PM </b>: {data.original.selectedPM}
                    </div>
                    <div className="mbsc-custom-event-name">
                        <b> 작업자 </b> : {workerCount}
                    </div>
                </div>
            </>
        );
    }, []);

    const loadPopupForm = useCallback((event) => {
        setTitle(event.title);
        setSelect(event.select);
        setDate([event.start, event.end]);
        setAllDay(event.allDay || false);
        setTravelTime(event.bufferBefore || 0);
        setStatus(event.status || "busy");
        setSelectedColor(event.color || "");
        setSelectedPM(event.selectedPM || ""); // 기존 이벤트의 PM 값 로드
        // selectedWorker 처리
        if (Array.isArray(event.selectedWorker)) {
            // 이미 배열 형태로 저장되어 있는 경우
            setSelectedWorker(event.selectedWorker);
        } else if (typeof event.selectedWorker === "string") {
            // 문자열인 경우 쉼표를 기준으로 분할하여 배열로 변환
            setSelectedWorker(event.selectedWorker.split(","));
        } else {
            // 기타 경우에는 빈 배열로 설정
            setSelectedWorker([]);
        }
    }, []);

    const handlePMChange = useCallback((ev) => {
        setSelectedPM(ev.value);
    }, []);

    // 작업자 선택 핸들러
    const handleWorkerChange = useCallback((ev) => {
        setSelectedWorker(ev.value);
    }, []);

    const titleChange = useCallback((ev) => {
        setTitle(ev.target.value);
    }, []);

    const selectChange = useCallback((ev) => {
        setSelect(ev.target.value);
    }, []);

    const allDayChange = useCallback((ev) => {
        setAllDay(ev.target.checked);
    }, []);

    const travelTimeChange = useCallback((ev) => {
        setTravelTime(ev.target.value);
    }, []);

    const dateChange = useCallback((args) => {
        setDate(args.value);
    }, []);

    const statusChange = useCallback((ev) => {
        setStatus(ev.target.value);
    }, []);

    const onDeleteClick = useCallback(() => {
        deleteEvent(tempEvent);
        setOpen(false);
    }, [deleteEvent, tempEvent]);

    // scheduler options

    const onSelectedDateChange = useCallback((event) => {
        setSelectedDate(event.date);
    }, []);

    const onEventClick = useCallback(
        (args) => {
            setEdit(true);
            setTempEvent({ ...args.event });
            // fill popup form with event data
            loadPopupForm(args.event);
            setAnchor(args.domEvent.target);
            setOpen(true);
        },
        [loadPopupForm]
    );

    const onEventCreated = useCallback(
        (args) => {
            // createNewEvent(args.event, args.target)
            setEdit(false);
            setTempEvent(args.event);
            // fill popup form with event data
            loadPopupForm(args.event);
            setAnchor(args.target);
            // open the popup
            setOpen(true);
        },
        [loadPopupForm]
    );

    const onEventDeleted = useCallback(
        (args) => {
            deleteEvent(args.event);
        },
        [deleteEvent]
    );

    const onEventUpdated = useCallback(() => {
        // here you can update the event in your storage as well, after drag & drop or resize
        // ...
    }, []);

    // datepicker options
    const controls = useMemo(
        () => (popupEventAllDay ? ["date"] : ["datetime"]),
        [popupEventAllDay]
    );
    const datepickerResponsive = useMemo(
        () =>
            popupEventAllDay
                ? {
                      medium: {
                          controls: ["calendar"],
                          touchUi: false,
                      },
                  }
                : {
                      medium: {
                          controls: ["calendar", "time"],
                          touchUi: false,
                      },
                  },
        [popupEventAllDay]
    );

    // popup options
    const headerText = useMemo(
        () => (isEdit ? "Edit event" : "New Event"),
        [isEdit]
    );
    const popupButtons = useMemo(() => {
        if (isEdit) {
            return [
                "cancel",
                {
                    handler: () => {
                        saveEvent();
                    },
                    keyCode: "enter",
                    text: "Save",
                    cssClass: "mbsc-popup-button-primary",
                },
            ];
        } else {
            return [
                "cancel",
                {
                    handler: () => {
                        saveEvent();
                    },
                    keyCode: "enter",
                    text: "Add",
                    cssClass: "mbsc-popup-button-primary",
                },
            ];
        }
    }, [isEdit, saveEvent]);

    const popupResponsive = useMemo(
        () => ({
            medium: {
                display: "anchored",
                width: 400,
                fullScreen: false,
                touchUi: false,
            },
        }),
        []
    );

    const onClose = useCallback(() => {
        if (!isEdit) {
            // refresh the list, if add popup was canceled, to remove the temporary event
            setMyEvents([...myEvents]);
        }
        setOpen(false);
    }, [isEdit, myEvents]);

    const selectColor = useCallback((color) => {
        setTempColor(color);
    }, []);

    const openColorPicker = useCallback(
        (ev) => {
            selectColor(selectedColor || "");
            setColorAnchor(ev.currentTarget);
            setColorPickerOpen(true);
        },
        [selectColor, selectedColor]
    );

    const changeColor = useCallback(
        (ev) => {
            const selectedColor = ev.currentTarget.getAttribute("data-value"); // 선택된 컬러 가져오기
            setTempColor(selectedColor); // 임시 색상 설정
            setColor(selectedColor); // 선택된 컬러 저장
            if (!colorPicker.current.s.buttons.length) {
                setSelectedColor(selectedColor); // 선택된 컬러를 영구적으로 저장
                setColorPickerOpen(false);
            }
        },
        [setColor, setTempColor, setSelectedColor, colorPicker]
    );

    return (
        <>
            <Eventcalendar
                view={myView}
                data={myEvents}
                renderEventContent={customEventContent}
                clickToCreate="double"
                dragToCreate={true}
                dragToMove={true}
                dragToResize={true}
                selectedDate={mySelectedDate}
                onSelectedDateChange={onSelectedDateChange}
                onEventClick={onEventClick}
                onEventCreated={onEventCreated}
                onEventDeleted={onEventDeleted}
                onEventUpdated={onEventUpdated}
            />
            <Popup
                display="anchored"
                fullScreen={true}
                contentPadding={false}
                headerText={headerText}
                anchor={anchor}
                buttons={popupButtons}
                isOpen={isOpen}
                onClose={onClose}
                responsive={popupResponsive}
            >
                <div className="mbsc-form-group">
                    <Input
                        label="현장명"
                        value={popupEventTitle}
                        onChange={titleChange}
                    />

                    <Select
                        label="PM"
                        data={myData}
                        display="center"
                        value={selectedPM}
                        onChange={handlePMChange}
                        touchUi={false}
                    />
                    <Select
                        label="작업자"
                        display="center"
                        data={myData}
                        value={selectedWorker}
                        onChange={handleWorkerChange}
                        selectMultiple={true}
                        touchUi={false}
                    />
                </div>
                <div className="mbsc-form-group">
                    {/* <Switch
                        label="All-day"
                        checked={popupEventAllDay}
                        onChange={allDayChange}
                    /> */}
                    <Input
                        ref={startRef}
                        label="Start & End"
                        placeholder="Please Select..."
                        value={
                            popupEventDate.length
                                ? `${new Date(
                                      popupEventDate[0]
                                  ).toLocaleDateString()} - ${new Date(
                                      popupEventDate[1]
                                  ).toLocaleDateString()}`
                                : ""
                        }
                    />

                    <Datepicker
                        select="range"
                        controls={["calendar"]}
                        touchUi={true}
                        display="anchored"
                        startInput={start}
                        endInput={end}
                        showRangeLabels={false}
                        responsive={datepickerResponsive}
                        onChange={dateChange}
                        value={popupEventDate}
                    />
                </div>

                <div onClick={openColorPicker} className="event-color-c">
                    <div className="event-color-label">Color</div>
                    <div
                        className="event-color"
                        style={{ background: selectedColor }}
                    ></div>
                </div>

                {isEdit ? (
                    <div className="mbsc-button-group">
                        <Button
                            className="mbsc-button-block"
                            color="danger"
                            variant="outline"
                            onClick={onDeleteClick}
                        >
                            Delete event
                        </Button>
                    </div>
                ) : null}
            </Popup>
            <Popup
                display="anchored"
                contentPadding={false}
                showArrow={false}
                showOverlay={false}
                anchor={colorAnchor}
                isOpen={colorPickerOpen}
                buttons={colorButtons}
                responsive={colorResponsive}
                ref={colorPicker}
                onClose={() => setColorPickerOpen(false)}
            >
                <div className="crud-color-row">
                    {colors.map((color, index) =>
                        index < 5 ? (
                            <div
                                key={index}
                                onClick={changeColor}
                                className={
                                    "crud-color-c " +
                                    (tempColor === color ? "selected" : "")
                                }
                                data-value={color}
                            >
                                <div
                                    className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                                    style={{ background: color }}
                                ></div>
                            </div>
                        ) : null
                    )}
                </div>
                <div className="crud-color-row">
                    {colors.map((color, index) =>
                        index >= 5 ? (
                            <div
                                key={index}
                                onClick={changeColor}
                                className={
                                    "crud-color-c " +
                                    (tempColor === color ? "selected" : "")
                                }
                                data-value={color}
                            >
                                <div
                                    className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                                    style={{ background: color }}
                                ></div>
                            </div>
                        ) : null
                    )}
                </div>{" "}
                <Toast
                    message={toastText}
                    isOpen={isToastOpen}
                    onClose={handleToastClose}
                />
            </Popup>
            <Snackbar
                isOpen={isSnackbarOpen}
                message="Event deleted"
                button={snackbarButton}
                onClose={handleSnackbarClose}
            />
        </>
    );
}

export default App;
