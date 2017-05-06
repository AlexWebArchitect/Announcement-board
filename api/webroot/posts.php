<?php
    $mysqli = mysqli_connect("db", "root", "phpapptest", "noticeboard");
	if (mysqli_connect_errno($mysqli))
		echo "Не удалось подключиться к MySQL: " . mysqli_connect_error();
        
	if (!$mysqli->set_charset("utf8")) {
    	printf("Ошибка при загрузке набора символов utf8: %s\n", $mysqli->error);
    	exit();
	}

    $last = intval($_GET['last']);

    if (!$last) {
        $query = mysqli_query($mysqli, "SELECT * FROM `notice`");
        if ($query) {
            $records = [];
            while ($record = mysqli_fetch_assoc($query)) {
                if ($record['date']) {
                    $time = strtotime($record['date']);
                    $record['date'] = "$time";
                }
                $records[] = $record;
            }
        }
        $shipment = json_encode($records, JSON_UNESCAPED_UNICODE);
        echo $shipment;
    }

    if ($last) {
        $query = mysqli_query($mysqli, "SELECT * FROM notice ORDER BY id DESC LIMIT 0, $last");
        if ($query) {
            $records = [];
            while ($record = mysqli_fetch_assoc($query)) {
                if ($record['date']) {
                    $time = strtotime($record['date']);
                    $record['date'] = "$time";
                }
                $records[] = $record;
            }
        }
        $shipment = json_encode($records, JSON_UNESCAPED_UNICODE);
        echo $shipment;
    }

    $method = $_SERVER['REQUEST_METHOD'];
    if ('DELETE' === $method) {
        parse_str(file_get_contents('php://input'), $_DELETE);
        $postToDel = intval($_DELETE['id']);
        $deletion = "DELETE FROM `notice` WHERE id='$postToDel'";
        if (mysqli_query($mysqli, $deletion)) {
            echo "record deleted successfully";
        } else {
            echo "Error: " . $deletion . "<br>" . mysqli_error($mysqli);
        }
    }
    if ('POST' === $method) {
        $title = $_POST['title'];
        $user_id = $_POST['user_id'];
        $user_id = intval($user_id);
        $content = $_POST['content'];
        $subcategory_id = $_POST['subcategory_id'];
        $subcategory_id = intval($subcategory_id);
        $insertion = "INSERT INTO notice (title, user_id, content, subcategory_id) VALUES ('$title', '$user_id', '$content', '$subcategory_id')";
        if (mysqli_query($mysqli, $insertion)) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $insertion . "<br>" . mysqli_error($mysqli);
        }
    }
    if ('PUT' === $method) {
        parse_str(file_get_contents('php://input'), $_PUT);
        $id = intval($_PUT['id']);
        $title = $_PUT['title'];
        $content = $_PUT['content'];
        $edition = "UPDATE notice SET title='$title', content='$content' WHERE id='$id'";
        if (mysqli_query($mysqli, $edition)) {
            echo "record edited successfully";
        } else {
            echo "Error: " . $edition . "<br>" . mysqli_error($mysqli);
        }
    }
?>