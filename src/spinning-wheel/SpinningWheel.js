import React from "react";
import "./SpinningWheel.css";

export default function SpinningWheel() {
    const selected = "selected";
    const unselected = "unselected";

    let getSegmentRect = (segment) => segment.getBoundingClientRect();

    let getSegmentsRightOf = (xOrigin) =>
        getSegments().filter(
            (segment) => getSegmentRect(segment).right > xOrigin + 200
        );

    function getSegments() {
        return Array.from(document.getElementsByClassName("segment"));
    }

    function sortHighest(a, b) {
        return getSegmentRect(b).top - getSegmentRect(a).top;
    }

    function findSegment() {
        const spinnerPosition = document
            .getElementById("spinner")
            .getBoundingClientRect();
        const xOrigin =
            spinnerPosition.left +
            (spinnerPosition.right - spinnerPosition.left) / 2;
        const sortedSegments = getSegmentsRightOf(xOrigin).sort(sortHighest);
        if (sortedSegments.length % 2 === 1) {
            setSelected(sortedSegments[Math.floor(sortedSegments.length / 2)]);
        }
    }

    function setSelected(selectedSegment) {
        selectedSegment.classList.add(selected);
        getSegments()
            .filter((segment) => segment !== selectedSegment)
            .forEach((segment) => setUnselected(segment));
    }

    function setUnselected(segment) {
        segment.classList.add(unselected);
    }

    function clearSelected() {
        getSegments().forEach((segment) => {
            segment.classList.remove(selected);
            segment.classList.remove(unselected);
        });
    }

    function getMainBox() {
        return document.getElementById("mainbox");
    }

    function performSpin() {
        const spinTimeMs = 5000;
        const min = 1024;
        const max = 9999;

        const rotation = Math.floor(Math.random() * (min - max)) + max;

        // In case not already cleared;
        getMainBox().classList.remove("animate");
        clearSelected();

        document.getElementById("wheel").style.transform =
            "rotate(" + rotation + "deg)";

        setTimeout(function () {
            getMainBox().classList.add("animate");
            findSegment();
        }, spinTimeMs);

        setTimeout(function () {
            getMainBox().classList.remove("animate");
            clearSelected();
        }, spinTimeMs * 3);
    }

    return (
        <div id="mainbox" className="mainbox">
            <div id="wheel" className="wheel">
                <div className="box1">
                    <div className="segment-1 segment">
                        <b>Sport</b>
                    </div>
                    <div className="segment-2 segment">
                        <b>Geography</b>
                    </div>
                    <div className="segment-3 segment">
                        <b>General Knowledge</b>
                    </div>
                    <div className="segment-4 segment">
                        <b>History</b>
                    </div>
                </div>
                <div className="box2">
                    <div className="segment-1 segment">
                        <b>Literature</b>
                    </div>
                    <div className="segment-2 segment">
                        <b>Film & TV</b>
                    </div>
                    <div className="segment-3 segment">
                        <b>Pub Quiz</b>
                    </div>
                    <div className="segment-4 segment">
                        <b>Music</b>
                    </div>
                </div>
            </div>

            <button id="spinner" className="spin" onClick={performSpin}>
                SPIN
            </button>
        </div>
    );
}
