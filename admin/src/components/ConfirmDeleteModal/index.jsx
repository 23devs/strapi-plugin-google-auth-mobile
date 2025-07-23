import React, { useState } from "react";
import {
  Button,
  Modal,
  Portal,
  Typography,
  Flex,
} from "@strapi/design-system";
import { useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from "../../pluginId";
import { ERROR, SUCCESS, TIMEOUT, wait } from "../../utils/alertsTimeout";

const ConfirmDeleteModal = ({ onClose, onUpdate, id }) => {
  const { del } = useFetchClient();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleStatus = async (status, message) => {
    status === SUCCESS ? setIsSuccess(true) : setIsError(true);
    setMessage(message);
    setLoading(false);
    await wait(TIMEOUT);
    status === SUCCESS ? setIsSuccess(false) : setIsError(false);
    setMessage("");
    if (status === SUCCESS) onClose();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      await del(`/${PLUGIN_ID}/credentials/${id}`);
      await onUpdate();
      await handleStatus(SUCCESS, "Entry was deleted successfully!");
    } catch (error) {
      await handleStatus(ERROR, "Unable to delete entry!");
    }
  };

  return (
    <Portal>
      <Modal.Root onClose={onClose} labelledBy="title" width="420px">
        <Modal.Content>
          <Modal.Header>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              tag="h2"
              id="title"
            >
              Delete confirmation
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <Flex direction="column" gap="16px">
              <Typography
                fontWeight="bold"
                textColor="neutral800"
                tag="h2"
                id="text"
              >
                Are you sure you want to delete CLIENT_ID for this app?
              </Typography>

              {isError && (
                <Typography
                  fontWeight="bold"
                  textColor="danger600"
                  tag="h2"
                  id="error"
                >
                  {message}
                </Typography>
              )}

              {isSuccess && (
                <Typography
                  fontWeight="bold"
                  textColor="success600"
                  tag="h2"
                  id="success"
                >
                  {message}
                </Typography>
              )}
            </Flex>
          </Modal.Body>
          <ModalFooter
            startActions={
              <>
                {!loading && (
                  <Button variant="danger" onClick={handleDelete}>
                    Yes
                  </Button>
                )}
                {loading && <Button loading>Loading...</Button>}
              </>
            }
            endActions={
              <Button onClick={onClose} variant="tertiary">
                Cancel
              </Button>
            }
          />
        </Modal.Content>
      </Modal.Root>
    </Portal>
  );
};

export default ConfirmDeleteModal;
