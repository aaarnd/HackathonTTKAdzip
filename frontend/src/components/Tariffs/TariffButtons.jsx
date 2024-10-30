import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import CreateTariffForm from "./CreateTariffForm";
import DeleteTariffForm from "./DeleteTariffForm";
import TariffModal from "./TariffModal";
import { getTariffs } from "../../API/api";

const TariffButtons = () => {
    const [isTariffCreateOpen, setIsTariffCreateOpen] = useState(false);
    const [isTariffDeleteOpen, setIsTariffDeleteOpen] = useState(false);
    const [isTariffModalOpen, setIsTariffModalOpen] = useState(false); 


    const openTariffCreate = () => setIsTariffCreateOpen(true);
    const closeTariffCreate = () => setIsTariffCreateOpen(false);
    const openTariffDelete = () => setIsTariffDeleteOpen(true);
    const closeTariffDelete = () => setIsTariffDeleteOpen(false);
    const openTariffModal = () => setIsTariffModalOpen(true); 
    const closeTariffModal = () => setIsTariffModalOpen(false); 

    const getAll = async () => { 
        const tariffs = await getTariffs();
        console.log(tariffs);
    };

    return (
        <div>
            <ButtonGroup aria-label="Basic example">
                <Button variant="secondary" onClick={openTariffCreate}>Добавить</Button>
                <Button variant="secondary">Изменить</Button>
                <Button variant="secondary" onClick={openTariffDelete}>Удалить</Button>
                <Button variant="secondary" onClick={openTariffModal}>Получить все</Button>
            </ButtonGroup>
            <CreateTariffForm show={isTariffCreateOpen} onClose={closeTariffCreate} /> 
            <DeleteTariffForm show={isTariffDeleteOpen} onClose={closeTariffDelete} /> 
            <TariffModal show={isTariffModalOpen} onClose={closeTariffModal} />
        </div>
    );
};

export default TariffButtons;
