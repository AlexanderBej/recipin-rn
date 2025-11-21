import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { theme } from "@/constants/theme/index";

interface ConfirmModalProps {
  message: string;
  buttonLabel: string;
  loading?: boolean;
  handleConfirm: () => Promise<unknown> | unknown;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  buttonLabel,
  loading,
  handleConfirm,
}) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirmClick = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await handleConfirm();
      setOpen(false); // close only on success
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canClose = !submitting;

  return (
    <>
      <Button
        variant="danger"
        onPress={() => setOpen(true)}
        disabled={submitting || loading}
      >
        {buttonLabel}
      </Button>

      <Modal
        isOpen={open}
        onClose={() => {
          if (canClose) setOpen(false);
        }}
        title="Confirm"
      >
        <View style={styles.body}>
          <Text style={styles.message}>{message}</Text>
          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            variant="primary"
            onPress={onConfirmClick}
            isLoading={submitting || loading}
            disabled={submitting || loading}
            style={styles.confirmBtn}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  body: {
    paddingTop: theme.spacing[2],
  },
  message: {
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  error: {
    marginTop: theme.spacing[2],
    color: theme.colors.error,
    fontSize: 13,
  },
  confirmBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
});
